
// import java.util.Scanner;

// public class condition {

// public static void main(String[] args) {
// Scanner sc = new Scanner(System.in);
// int button = sc.nextInt();

//     switch (button) {
//         case 1 -> System.out.println("Hello");
//         case 2 -> System.out.println("Heyy");
//         case 3 -> System.out.println("Hlooo");
//         default -> System.out.println("Invalid button");
//     }




// }
  
// }


public class condition {
public static void main(String[] args) {
    int salary = 25000;
    // if(salary > 10000){
    //     salary = salary + 20000;
    // } else{
    //     salary = salary + 1000;
    // }


    // Multiline condition
if (salary > 20000) {        
     salary += 30000;
}else if (salary > 30000) {
      salary += 50000;
}else{
      salary += 40000;
}


    System.out.println(salary);
}
    
}
