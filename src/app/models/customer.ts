import {BasicInfo} from './basicInfo';
import {Address} from './address';
import {Contact} from './contact';
import {Employment} from './employment';
import {Document} from './document';
import {BankAccount} from './bank-account';

export class Customer {
  id: number;
  basicInfo: BasicInfo;
  addresses: Array<Address>;
  contact: Contact;
  employments: Array<Employment>;
  documents: Array<Document>;
  bankAccounts: Array<BankAccount>;
  accesses = {};
}
