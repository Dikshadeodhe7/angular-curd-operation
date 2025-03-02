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
      currentPage: number = 1;
      itemsPerPage: number = 5;

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
          this.filterEmployees();
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
          this.storeLocalStorage();
          this.employeeForm.reset();
          
      }

      loadEmployeeList() {
          const data = localStorage.getItem('employees');
          this.employeeList =  data ? JSON.parse(data) : [];
          this.currentPage = 1;
          this.filterEmployees();
      }

      editEmployee(index: number) {
          this.editIndex = index;
          this.employeeForm.patchValue(this.filteredEmployees[index]);
      }

      deleteEmployee(index: number) {
          const actualindex = (this.currentPage - 1) * this.itemsPerPage + index;
          this.employeeList.splice(actualindex, 1);
          this.storeLocalStorage();

          // **Fix: Adjust Pagination If Needed**
          const totalPages = Math.ceil(this.employeeList.length / this.itemsPerPage);
          if (this.currentPage > totalPages) {
            this.currentPage = totalPages || 1; // Ensure at least page 1
          }

          this.filterEmployees();
      }

      filterEmployees() {
          const fitered = this.employeeList.filter(emp => {
              return emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              emp.department.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              emp.salary.toLowerCase().includes(this.searchQuery.toLowerCase());
          })

          this.filteredEmployees = fitered.slice(
              (this.currentPage - 1) * this.itemsPerPage,
              this.currentPage * this.itemsPerPage
          )
      }

      get totalPages(): number[] {
        let pageCount = Math.ceil(this.employeeList.length / this.itemsPerPage); // Ensure proper rounding
        return Array.from({ length: pageCount }, (_, i) => i + 1); // Generate correct page numbers (starting from 1)
      }
      

      changePage(page: number) {  
        //console.log(this.currentPage);
        this.currentPage = page;
        this.filterEmployees();
      }
}
