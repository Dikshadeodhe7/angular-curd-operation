import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
      employeeForm!: FormGroup;
      employeeList: any[] = [];
      filteredEmployees: any[] = [];
      editIndex: number | null = null;
      searchQuery: string = '';

      constructor(private fb: FormBuilder) {}

      ngOnInit(): void {
          this.employeeForm = this.fb.group({
              name: ['', Validators.required],
              department: ['', Validators.required],
              salary: ['', Validators.required]
          });

          this.loadEmployeeList();
      }

      storeLocalStorage() {
          localStorage.setItem('employees', JSON.stringify(this.employeeList));
      }

      addEmployee() {

          if(this.employeeForm.valid)  {
             if(this.editIndex === null) {
                this.employeeList.push(this.employeeForm.value);
             } else  {
                this.employeeList[this.editIndex] = this.employeeForm.value;
                this.editIndex = null;
             }  
          }
          //console.log(this.employeeList);
          this.employeeForm.reset();
          this.storeLocalStorage();
      }

      loadEmployeeList() {
          const data = localStorage.getItem('employees');
          this.employeeList =  data ? JSON.parse(data) : [];
          this.filteredEmployees = [...this.employeeList];
      }

      editEmployee(index: number) {
          this.editIndex = index;
          this.employeeForm.patchValue(this.employeeList[index]);
      }

      deleteEmployee(index: number) {
          this.employeeList.splice(index, 1);
          this.storeLocalStorage();
      }

      filterEmployees() {
          const filter = this.employeeList.filter(emp => {
              return emp.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          })
          this.filteredEmployees = filter;
      }
}
