import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proprietes } from './proprietes';

describe('Proprietes', () => {
  let component: Proprietes;
  let fixture: ComponentFixture<Proprietes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Proprietes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Proprietes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
