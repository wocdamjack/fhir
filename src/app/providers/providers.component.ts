/// <reference path=".,/../../../fhir.r4/index.d.ts" />

import { Component, OnInit } from '@angular/core';
import { FhirJsHttpService, FHIR_HTTP_CONFIG, QueryObj } from 'ng-fhirjs';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'],
})
export class ProvidersComponent implements OnInit {
  searched = false;
  bundle: fhir.r4.Bundle;
  dataSource = new MatTableDataSource<fhir.r4.BundleEntry>();

  length = 100;
  pageSize = 10;
  pageIndex = 0;

  pageSizeOptions = [this.pageSize];
  public searchName: FormControl;
  public searchNameValue = '';

  selectedPractitioner: fhir.r4.Practitioner;

  constructor(private fhirHttpService: FhirJsHttpService) {
    const query = <QueryObj>{
      type: 'Practitioner',
      query: {
        _count: this.pageSize,
        _summary: 'true',
        _sort: 'family',
      },
    };
    this.searchName = new FormControl();
    this.searchName.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(term => {
        console.log('called with ' + term);
        const queryName = { ...query };
        queryName.query = { ...query.query };
        if (term) {
          queryName.query.name = term;
        }
        fhirHttpService.search(queryName).then(response => {
          this.pageIndex = 0;
          this.setBundle(<fhir.r4.Bundle>response.data);
        });
      });
    fhirHttpService.search(query).then(response => {
      this.setBundle(<fhir.r4.Bundle>response.data);
    });
  }

  getPractitionerFamilyName(entry: fhir.r4.BundleEntry): string {
    const Practitioner = <fhir.r4.Practitioner>entry.resource;
    if (Practitioner.name && Practitioner.name.length > 0 && Practitioner.name[0].family) {
      return Practitioner.name[0].family;
    }
    return '';
  }

  getPractitionerGivenNames(entry: fhir.r4.BundleEntry): string {
    const Practitioner = <fhir.r4.Practitioner>entry.resource;
    if (Practitioner.name && Practitioner.name.length > 0 && Practitioner.name[0].given) {
      return (<fhir.r4.Practitioner>entry.resource).name[0].given.join(' ');
    }
    return '';
  }

  getPractitionerBirthDate(entry: fhir.r4.BundleEntry): string {
    const Practitioner = <fhir.r4.Practitioner>entry.resource;
    if (Practitioner.birthDate) {
      return Practitioner.birthDate;
    }
    return '';
  }

  getPractitionerAddressLines(entry: fhir.r4.BundleEntry): string {
    const Practitioner = <fhir.r4.Practitioner>entry.resource;
    if (
      Practitioner.address &&
      Practitioner.address.length > 0 &&
      Practitioner.address[0].line
    ) {
      return Practitioner.address[0].line.join(', ');
    }
    return '';
  }

  getPractitionerAddressCity(entry: fhir.r4.BundleEntry): string {
    const Practitioner = <fhir.r4.Practitioner>entry.resource;
    if (
      Practitioner.address &&
      Practitioner.address.length > 0 &&
      Practitioner.address[0].city
    ) {
      return Practitioner.address[0].city;
    }
    return '';
  }

  selectRow(row: fhir.r4.BundleEntry) {
    const selection = row.resource;
    const readObj = { type: 'Practitioner', id: selection.id };
    this.fhirHttpService.read(readObj).then(response => {
      this.selectedPractitioner = response.data;
    });
  }

  goToPage(event: PageEvent) {
    if (event.pageIndex > this.pageIndex) {
      this.fhirHttpService.nextPage({ bundle: this.bundle }).then(response => {
        this.pageIndex = event.pageIndex;
        this.setBundle(<fhir.r4.Bundle>response.data);
        console.log('next page called ');
      });
    } else {
      this.fhirHttpService.prevPage({ bundle: this.bundle }).then(response => {
        this.pageIndex = event.pageIndex;
        this.setBundle(<fhir.r4.Bundle>response.data);
        console.log('previous page called ');
      });
    }
  }

  setBundle(bundle: fhir.r4.Bundle) {
    this.bundle = <fhir.r4.Bundle>bundle;
    this.length = this.bundle.total;
    this.dataSource.data = this.bundle.entry;
    this.selectedPractitioner = undefined;
  }

  ngOnInit() {}
}
