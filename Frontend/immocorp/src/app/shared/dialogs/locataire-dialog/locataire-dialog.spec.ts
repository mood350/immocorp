import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocataireDialog } from './locataire-dialog';

describe('LocataireDialog', () => {
  let component: LocataireDialog;
  let fixture: ComponentFixture<LocataireDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocataireDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocataireDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
