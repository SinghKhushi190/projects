// shallow and deep constructor
#include<iostream>
#include<string>
using namespace std;

class Student {
    public:
    string name;
    double*cgpaPtr;

    Student(string name, double cgpa){
        this->name = name;
        cgpaPtr = new double;
        *cgpaPtr = cgpa;
    }
//  Destructor
    ~Student(){
        cout<< "Hey , I delete everything...\n";
        delete cgpaPtr; // memory leak
    }

    // Student(Student &obj){
    //     this -> name = obj.name;
    //     // cgpaPtr = new double;
    //      this ->cgpaPtr = obj.cgpaPtr;
    // }

    void getInfo(){
        cout<<"name :" << name <<endl;
        cout << "CGPA :" << *cgpaPtr <<endl;
    }
    
};

int main(){
    Student s1("rahul Kumar" , 8.9);
    s1.getInfo();
    // Student s2(s1);
    // s1.getInfo();
    // *(s2.cgpaPtr) = 9.2;
    // s2.getInfo();
    return 0;
}


// Inheritance
class Person{
    public:
    string name;
    int age;
    Person(){
    cout << "Hey , this is a parents class ... \n";
    }
    
};

class student : public Person{
    public:
    int rollno;
    student(){
    cout << "Hey , This is a child class.... \n";
    }
    void getInfo(){
        cout<< "name :" << name << endl;
        cout << "rollno :" << rollno << endl;
        cout << "age :" << age << endl;
    }
};

int main(){
    student s1;
    s1.name = "Neha Kumari";
    s1.rollno = 11089;
    s1.age = 21;

    s1.getInfo();
    return 0;

}


//Polymorphism
class student1 {
  public:
  string name;

  student1(){
    cout<< "non-parameterized\n";
  }
  student1(string name){
    this->name = name;
    cout<<"parameterized\n";
  }
      
};

int main(){
    student1 s1("tony strak");
    return 0;
}

// Compile time Polymorphism(Function overloading)
class print{
    public:
     void show(int x){
        cout<< "int :"<< x <<endl;
     }

     void show(char ch){
        cout << "char : "<<endl;
     }
};

int main(){
    print p1;
    // p1.show(101); // this is show integer value
    p1.show('&');  // this is show char value

}

// Run time polymorphism(Function overriding)
class parent{
    public:
    void getinfo(){
        cout<< "parent class\n";
    }
};

class child : public parent{
    public:
    void getInfo(){
        cout<< "child class\n";
    }
};

int main(){
    // child p1;   // child class
    parent p1;    // parent class
    p1.getinfo();
    return 0;
}

// virtual class
class parent{
    public:
    void getinfo(){
        cout<< "parent class\n";
    }
    virtual void hello(){
        cout<< "hello from parent\n";
    }
};

class child : public parent{
    public:
    void getInfo(){
        cout<< "child class\n";
    }
     void hello(){
        cout<< "hello from child\n";
    }
};

int main(){
    child c1;
    c1.hello();  // hello from child
    return 0;
}

// Abstraction
class Shape{// abstract class
    virtual void draw() = 0; // pure virtual class
};

class Circle : public Shape{
    public:
      void draw(){
        cout << "drawing a circle\n";
      }
};

int main(){
    Circle c1;
    c1.draw();
    return 0;
}

// Static Keywords
// static variable(for in function)
void fun(){
    static int x = 0; // int statement -> 1 run
    cout << "x :"<< x<<endl;
    x++;
}

int main(){
    fun(); // 0
    fun(); // 1
    fun(); // 2
    fun();  // 3
    return 0;
}

// (for "in class")
class A{
    public:
    int x;

    void incX(){
        x = x + 1;
    }
};

int main(){
    A obj;
    obj.x = 0;
    cout << obj.x << endl;
    obj.incX();
    cout << obj.x << endl;
    return 0;
    
}

// static object
class ABC{
    public:
     ABC(){
        cout << "constrctor\n";
     }
     ~ABC(){
        cout<< "destuctor\n";
     }
};
int main(){
    if(true){
       static ABC obj;
    }
    cout << "end of main fun\n";
    return 0;
}
