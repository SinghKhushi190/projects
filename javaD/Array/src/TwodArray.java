// print thw spiral order matrix  as output for a given matrix of numbers

import java.util.Scanner;

public class TwodArray {
    public static void main(String[] args) {
   Scanner sc = new Scanner(System.in);
       int row = sc.nextInt();
       int col = sc.nextInt();
       int [][] matrix = new int[row][col];

       for(int i=0;i<row;i++){
           for(int j=0;j<col;j++){
               matrix[i][j]=sc.nextInt();
           }
       }

       int row_start= 0 , row_end = row-1;
       int col_start = 0 , col_end = col - 1;

        System.out.println("Print Spiral");

        while(row_start<=row_end && col_start<=col_end){
            for(int i=row_start;i<=col_end;i++){
                System.out.println(matrix[row_start][i] + " ");
            }
            row_start++;
            for(int i=row_start;i<=row_end;i++){
                System.out.println(matrix[i][col_start] + " ");
            }
            col_end--;

            if(row_start<=row_end ){
                for(int i = col_end;i<=col_start;i++){
                    System.out.println(matrix[row_end][i] + " ");
                }
                row_end--;
            }
            if(col_start<=col_end){
                for(int i = row_end;i<=row_start;i++){
                    System.out.println(matrix[i][col_start] + " ");
                }
                col_start++;
            }
            System.out.println();
        }
    }
}
