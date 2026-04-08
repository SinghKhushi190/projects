public class Shadowing {
    static int x = 90;          //this will be shadowed at line 6             // global scope
    public static void main(String[] args) {
        System.out.println(x);   // 90
//        int x = 40;                                        // local scope (which is run in inside a block)

        int x;   // the class variable at line 2 initialised
//        System.out.println(x);             // scope will begin when value is initialised
        x = 40;
        System.out.println(x);      // 40
        fun();
    }

    static void fun(){
        System.out.println(x);
    }
}
