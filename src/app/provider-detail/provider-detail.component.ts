/// <reference path=".,/../../../fhir.r4/index.d.ts" />

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-provider-detail',
  templateUrl: './provider-detail.component.html',
  styleUrls: ['./provider-detail.component.scss'],
})
export class ProviderDetailComponent implements OnInit {
  @Input() provider: fhir.r4.Practitioner;

  constructor() {}

  ngOnInit() {}
}
