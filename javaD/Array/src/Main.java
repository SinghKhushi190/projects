
public class Main {
    public static void main(String[] args) {
        //syntax
        //datatype[] variable_name = new datatype[size];
        //store 5 roll numbers;
//        int[] nos2 = new int[5];
//        or directly
//        int[] nos2 = {23,34,45,56,67,78,89,90};

        int[] ros;      // declaration of array. ros is getting in the stack
        ros = new int[3];     //  initialization: actually here object is being created in the memory (heap)

//        System.out.println(ros[1]);
        String[] arr = new String[3];
        System.out.println(arr[0]);

        for(String element: arr){
            System.out.println(element);

        }





}
}