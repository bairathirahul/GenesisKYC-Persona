import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivatedRoute} from '@angular/router';
import {Customer} from '../models/customer';
import {CustomerService} from '../customer.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit, OnDestroy {
  customer: Customer;
  private sub: any;

  constructor(private route: ActivatedRoute, private service: CustomerService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      for (const customer of this.service.customers) {
        if (customer.id === params['id']) {
          this.customer = customer;
          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  getPersona() {
    return environment.persona;
  }
}
