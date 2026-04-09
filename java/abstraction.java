
abstract class Shape {

    abstract void draw();   // no body

    void display() {
        System.out.println("This is a shape");
    }
}

class Circle extends Shape {

    void draw() {
        System.out.println("Drawing Circle");
    }
}

public class abstraction {
    public static void main(String[] args) {
        Shape s = new Circle();  // reference of abstract class
        s.display();
        s.draw();
    }
}
