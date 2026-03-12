import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementDialog } from './paiement-dialog';

describe('PaiementDialog', () => {
  let component: PaiementDialog;
  let fixture: ComponentFixture<PaiementDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaiementDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaiementDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
