import { Component, inject, OnInit } from '@angular/core';
import { Employee, User, UserDTO } from '../../../interfaces/employee';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit{

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private employeeService = inject(EmployeeService);
  newUser!: User;
  userDto!: UserDTO;

  ngOnInit(){
    this.resetNewUser();
    this.resetEmptyUserDto();
  }

  resetEmptyUserDto(){
    this.userDto = {
      username: '',
      password: '',
      companyId: -1,
      employeeId: -1
    }
  }

  resetNewUser() {
    this.newUser = {
      id: undefined,
      username: '',
      password: '',
      company: {
        id: undefined,
        name: '',
        tables: 0
      },
      employee: {
        id: undefined,
        role: '',
        person: {
          name: '',
          lastName: '',
          phone: '',
          email: '',
          dni: '',
          address: {
            street: '',
            number: 0,
            city: '',
            state: '',
            country: ''
          }
        }
      }
  };
}

  onSubmitForm(){
    const companyId = this.authService.getCompanyId();
    let employee = this.newUser.employee;
    this.userDto = {
      username: this.newUser.username,
      password: this.newUser.password,
      companyId: companyId,
      employeeId: employee.id ? employee.id : 0
    }

    console.log(this.newUser);

    // try {
      // Cargo primero los datos del empleado
      // this.employeeService.createEmployee(employee)
      //   .subscribe({
      //     next: (emp) => {
      //       employee = {...employee, id: emp.id}
      //       console.log("Empleado: ", employee);
      //       this.userDto = {...this.userDto, employeeId: emp.id! }
      //     },
      //     error: (err) => {
      //       // alert("No se pudo cargar el nuevo empleado.\nIntente nuevamente.");
      //       // console.error("error: ", err);
      //       throw new Error("No se pudo cargar empleado", err);
      //     }
      //   });

      // // Cargo al nuevo usuario
      this.userService.createUser(this.userDto)
        .subscribe({
          next: (resp) => {
            alert("Se creo el nuevo empleado satisfactoriamente.\n");
          },
          error: (err) =>{
            throw new Error("Error a cargar nuevo usuario. ", err);
          }
        })
      
    // } catch (error) {
    //   alert("Hubo un error al cargar el nuevo empleado.\nIntente nuevamente.")
    //   console.error("Error: ", error);
    // }

    //Reseteo userDto
    this.resetEmptyUserDto();
    //Reseteo newUser
    this.resetNewUser();
  }



}
