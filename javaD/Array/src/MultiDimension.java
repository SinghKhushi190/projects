import java.util.Arrays;
import java.util.Scanner;

public class MultiDimension {
    public static void main(String[] args) {
        Scanner in  = new Scanner(System.in);
       /*
               1 2 3
               4 5 6
               7 8 9
        */
        //int[][] arr = new int[3][];


//        int[][] arr = {
//                {1, 2, 3},  // 0th index
//                {4, 5, 6},    // 1st index
//                {7, 8, 9}     // 2nd index   -> 2nd[2] = {7, 8 ,9}
//       };
        int[][] arr = new int[3][3];
        System.out.println(arr.length);

        //input
        for(int row = 0 ; row < arr.length ; row++){
            // for  each column in every rows
            for(int col = 0 ; col < arr[row].length ; col++){
                arr[row][col] = in.nextInt();
            }
        }

        //Output
//        for(int row = 0 ; row < arr.length ; row++){
//            for(int col = 0 ; col < arr[row].length ; col++){
//                System.out.print(arr[row][col] + " ");
//            }
//            System.out.println();
//        }
        // Another Methods
//        for(int row = 0 ; row < arr.length ; row++){                     // Output
//            System.out.println(Arrays.toString(arr[row]));
//        }

        // Enhanced for loop method in (output)
        for(int[] a: arr){
            System.out.println(Arrays.toString(a));
        }
    }
}
