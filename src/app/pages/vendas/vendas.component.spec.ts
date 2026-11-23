import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { VendasComponent } from './vendas.component';

describe('VendasComponent', () => {
  let component: VendasComponent;
  let fixture: ComponentFixture<VendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendasComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
