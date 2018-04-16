import {Injectable} from '@angular/core';
import {Customer} from './models/customer';
import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BasicInfo} from './models/basicInfo';
import {Address} from './models/address';
import {Contact} from './models/contact';
import {Employment} from './models/employment';
import {BankAccount} from './models/bank-account';
import {Document} from './models/document';
import {map} from 'rxjs/operators';

@Injectable()
export class CustomerService {

  customers: Array<Customer>;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  obcParams = {
    url: null,
    channel: 'kycaccess',
    chaincode: 'genesiskyc',
    chaincodeVer: 'v1.2.0',
    method: null,
    args: null
  };

  constructor(private http: HttpClient) {
  }

  searchCustomers(query) {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'searchCustomer';
    params.args = [query];
    params.url = environment.queryURL;
    delete this.customers;
    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions)
      .pipe(map(function (response: any) {
          service.customers = Array<Customer>();
          if (response.returnCode === 'Success') {
            if (response.result == null || response.result.length === 0) {
              return Array<Customer>();
            }

            const data = JSON.parse(response.result);
            for (const entry of data) {
              const customer = new Customer();
              customer.id = parseInt(entry.Record.ID, 10);
              customer.basicInfo = BasicInfo.convert(entry.Record.BasicInfo);
              customer.addresses = Address.convert(entry.Record.Addresses);
              customer.contact = Contact.convert(entry.Record.Contact);
              customer.bankAccounts = BankAccount.convert(entry.Record.BankAccounts);
              customer.employments = Employment.convert(entry.Record.Employments);
              customer.documents = Document.convert(entry.Record.Documents);
              customer.accesses = entry.Record.Accesses;
              if(customer.accesses === null) {
                customer.accesses = {};
              }
              service.customers.push(customer);
            }
          }
          return response;
        }
      ));
  }

  requestCustomer(customer) {
    const service = this;
    const params = {...this.obcParams};
    params.method = 'requestCustomerAccess';
    params.args = [customer.id.toString()];
    params.url = environment.queryURL;
    return this.http.post(environment.serviceURL + 'proxy', params, this.httpOptions)
      .pipe(map(function (response: any) {
          if (response.returnCode === 'Success') {
            customer.accesses[environment.persona] = true;
          }
          return response;
        }
      ));
  }

  getCustomers() {
    return this.customers;
  }

  getDocumentUrl(documentID, customer_id) {
    return environment.serviceURL + 'read?id=' + documentID + '&customer_id=' + customer_id;
  }
}
