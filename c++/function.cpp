#include <iostream>
using namespace std;

inline int add(int x , int y){
    return x + y;
}

int main(){
    cout << "Sum = " << add( 10 , 20);
    return 0;
}

// New & Delete 
// int main(){
//     int * ptr = new int ;  // dymamic memory allocation
//     cout << "Enter a value:";
//     cin >> *ptr;
//     cout << " You entered :" << * ptr << endl;
//     delete ptr; // free memory
//     return 0;
// }


// operator using program

// int main() {
//     int a, b;
//     cout << "Enter two numbers: ";
//     cin >> a >> b;

//     cout << "Addition: " << a + b << endl;
//     cout << "Subtraction: " << a - b << endl;
//     cout << "Multiplication: " << a * b << endl;
//     cout << "Division: " << a / b << endl;
//     cout << "Modulus: " << a % b << endl;

//     cout << "Relational (a > b): " << (a > b) << endl;
//     cout << "Logical (a && b): " << (a && b) << endl;

//     return 0;
// }


// class Demo {
// public:
//     Demo() {
//         cout << "Constructor Called!" << endl;
//     }

//     ~Demo() {
//         cout << "Destructor Called!" << endl;
//     }
// };

// int main() {
//     Demo obj; // constructor invoked
//     return 0; // destructor invoked at end
// }



// virtual Function
// class Base {
// public:
//     virtual void show() {
//         cout << "Base class show()" << endl;
//     }
// };

// class Derived : public Base {
// public:
//     void show() {
//         cout << "Derived class show()" << endl;
//     }
// };

// int main() {
//     Base *ptr;
//     Derived d;

//     ptr = &d;
//     ptr->show(); // calls derived show()
//     return 0;
// }

// class Animal{
//     public:
//     void eat(){
//         cout << "Animal can eat"<< endl;
//     }
// };

// class Dog : public Animal{
//     public:
//     void bark(){
//     cout << "Dog can bark"<< endl;
//     }
// };

// int main (){
//     Dog d;
//     d.eat();
//     d.bark();
//     return 0;
// }
// class Add{
//     int a;
//     public:
//     Add(int x =0){
//         a = x;
//     }

//     Add operator + (Add obj){
//         Add result;
//         result . a = a + obj .a;
//         return result;
//     }
//     void show(){
//         cout << "result = " << a << endl;
//     }

// };

// int main(){
//     Add n1(10) , n2(11);
//     Add Sum = n1 + n2 ;
//       Sum.show();
//       return 0;
// }

// class and object
// class student{
//     public:
//        string name;
//        int age;

//        void input(){
//           cout << "name";
//           cin >> name;
//           cout << "age";
//           cin >> age;
//        }
//        void display(){
//         cout << "name"<< name << "\nage"<< age<<endl;
//        }
//     };
//        int main(){
//         student s1;
//         s1. input();
//         s1 . display();
//         return 0;
//        }

