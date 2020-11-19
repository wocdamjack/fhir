import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FhirConfig, FhirJsHttpService, FHIR_HTTP_CONFIG } from 'ng-fhirjs';
import { ProvidersComponent } from './providers.component';
import { MatTableModule } from '@angular/material';
import { ProviderDetailComponent } from '../provider-detail/provider-detail.component';

export const FHIR_JS_CONFIG: FhirConfig = {
  baseUrl: 'http://test.fhir.org/r3',
  credentials: 'same-origin',
};

describe('ProvidersComponent', () => {
  let component: ProvidersComponent;
  let fixture: ComponentFixture<ProvidersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProvidersComponent, ProviderDetailComponent],
      imports: [
        MatTableModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        BrowserAnimationsModule,
      ],
      providers: [
        FhirJsHttpService,
        { provide: FHIR_HTTP_CONFIG, useValue: FHIR_JS_CONFIG },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
