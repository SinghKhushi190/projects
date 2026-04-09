
class Student {

    // private data members
    private String name;
    private int age;

    // public getter method
    public String getName() {
        return name;
    }

    // public setter method
    public void setName(String name) {
        this.name = name;
    }

    // public getter method
    public int getAge() {
        return age;
    }

    // public setter method
    public void setAge(int age) {
        if (age > 0) {   // validation
            this.age = age;
        }
    }
}

public class encapsulation {

    public static void main(String[] args) {
        Student s = new Student();
        s.setName("Khushi");
        s.setAge(20);

        System.out.println(s.getName());
        System.out.println(s.getAge());
    }
}
