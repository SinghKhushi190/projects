import java.util.Arrays;
import java.util.Scanner;

public class Input {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
//        Array of primitives
//        int[]  arr = new int[5];
//       arr[0] = 1;
//       arr[1] = 2;
//       arr[2] = 453;
//      arr[3] = 564;
//     arr[4] = 675;
//
//        System.out.println(arr[3]);


        // input  using for loops
//        for(int i = 0; i <arr.length; i++) {
//            arr[i] = in.nextInt();
//        }
//
//        System.out.println(Arrays.toString(arr));
//
//        for(int i = 0; i  < arr.length; i++) {
//            System.out.println(arr[i] + " ");
//        }

//        for(int i = 0; i < arr.length; i++) {
//
//        }

//        System.out.println(arr[3]);      //index out of bond error


       // for(int num: arr){          // for every element in array, print the element
            //System.out.println( num + " ")  ;// here num represent element of the array
       //- }

        // Array  of object

        String[] str = new String[4];
        for(int i = 0; i < str.length; i++) {
            str[i] = in.next();
        }
        System.out.println(Arrays.toString(str));

        // modify
        str[2] = "kunal";

        System.out.println(Arrays.toString(str));
    }
}



