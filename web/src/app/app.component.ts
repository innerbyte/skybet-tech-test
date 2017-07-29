
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public form_group: FormGroup;
  public fb: FormBuilder;

  constructor(fb: FormBuilder) {
    this.fb = fb;
    this.create_form();
  }

  public create_form() {
    this.form_group = this.fb.group({
      email: [
        'boo2',
        Validators.required
      ],
      password: 'test'
    });
  }

  onSubmit() {
    // e.preventDefault();
    console.log("on submit");
  }

  ngOnInit() {

  }
}