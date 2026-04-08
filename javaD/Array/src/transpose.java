import java.util.Scanner;

public class transpose {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int m  = sc.nextInt();
        int n = sc.nextInt();

        int [][] matrix = new int[m][n];

        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                matrix[i][j]=sc.nextInt();
            }
        }

        System.out.println("the transpose matrix is:");

        for(int j = 0; j <m; j++){
            for(int i = 0; i <n ;i++){
                System.out.print(matrix[j][i]+" ");
            }
            System.out.println();
        }
            }
}



