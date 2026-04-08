
    /*
       In scoping we can only change in inside the functions, we can not change the outside to the functions
     */

    public class Scope{
        public static void main(String[] args){
            int a = 30;
            int b = 20;
            String name = "Rahul";

            {
//                     int a =78;          // already initialised outside the block in the same method, hence you cannot initialise  again
                    a = 100;     // here reassign the origin reference variable to some other value
                System.out.println(a);
                int c = 99;
                name = "Rahul";
                System.out.println(name);
                    // values initialized in this block, will remain in block
            }
            System.out.println(a);
            System.out.println(name);
//            System.out.println(c);   // cannot use outside the block


            //Scoping in for loop

            for(int i = 0; i <= 4; i++){
                System.out.println(i);
                int num = 90;
                int e = 10;
            }
//            System.out.println(i);
        }
        static void random(int marks){
            int num = 67;
            System.out.println(num);

            System.out.println(marks);
        }
    }
