

public class Patterns{
    public static void main(String[] args) {
        // int n=5;
        // for(int i=1;i<=n;i++){
        //     for(int j=1;j<=i;j++){
        //         System.out.print("* ");
        //     }
        //     System.out.println();
        // }



        // int n = 5; // size of half wings, change to make bigger/smaller

        // // Upper half
        // for (int i = 1; i <= n; i++) {
        //     // left stars
        //     for (int j = 1; j <= i; j++) {
        //         System.out.print("*");
        //     }

        //     // spaces in middle
        //     for (int j = 1; j <= 2 * (n - i); j++) {
        //         System.out.print(" ");
        //     }

        //     // right stars
        //     for (int j = 1; j <= i; j++) {
        //         System.out.print("*");
        //     }

        //     System.out.println();
        // }

        // // Lower half
        // for (int i = n; i >= 1; i--) {
        //     // left stars
        //     for (int j = 1; j <= i; j++) {
        //         System.out.print("*");
        //     }

        //     // spaces in middle
        //     for (int j = 1; j <= 2 * (n - i); j++) {
        //         System.out.print(" ");
        //     }

        //     // right stars
        //     for (int j = 1; j <= i; j++) {
        //         System.out.print("*");
        //     }

        //     System.out.println();
        // }


        // int n=5;                          // solid Rombous
        // for (int i = 1; i <= n; i++) {
        //     // spaces
        //     for (int j = 1; j <= n - i; j++) {
        //         System.out.print(" ");
        //     }
        //     // stars
        //     for (int j = 1; j <= n; j++) {
        //         System.out.print("*");
        //     }
        //     System.out.println();
            
        // }


//         int n = 4;              // pyramide pattern
// for (int i = 1; i<=n; i++) {
//     for (int j = 1; j <= n - i; j++) {
//         System.out.print(" ");
        
//     }
//     for (int j = 1; j <= i; j++) {
//         System.out.print("* ");
        
//     }
//     System.out.println();
// }


// int n =4;                  // half pyramide
// for(int i=1;i<=n;i++){
//     for(int j=1;j<=n-i;j++){
//         System.out.print(" ");
//     }
//     for(int j=1;j<=i;j++){
//         System.out.print("*");
//     }
//     System.out.println(); 
// }


// int n=5;   

// for(int i=1;i<=n;i++){
//     for(int j=1;j<=n-i;j++){
//         System.out.print(" ");
//     }
//     for(int j=1;j<=i;j++){
//         System.out.print(i + " ");
//     }

//     System.out.println();
// }


int n=5;                   //  half pyramide
for(int i=1;i<=n;i++){
    for(int j=1;j<=i;j++){
        System.out.print(" ");
    }
    for(int j=1;j<=i;j++){
        System.out.print(i+ " ");
    }
    System.out.println(); 
    }
}
}
       
       
 
         
      

