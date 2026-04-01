import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocatairesComponent } from './locataires';

describe('Locataires', () => {
  let component: LocatairesComponent;
  let fixture: ComponentFixture<LocatairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocatairesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocatairesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
