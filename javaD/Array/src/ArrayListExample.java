import java.util.ArrayList;
import java.util.Scanner;

public class ArrayListExample {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
        //syntax
        ArrayList<Integer> list = new ArrayList<>(5);
        list.add(67);
        list.add(78);
        list.add(90);
        list.add(91);
        list.add(92);
        list.add(93);

//        System.out.println(list.contains(56757));
//        System.out.println(list);
//        list.set(0 , 99);
//        list.remove(2);
//
//        System.out.println(list);

        //input
        for(int i = 0; i < 5; i++){
            list.add(input.nextInt());
        }
        //get items at any index
        for(int i = 0; i < 5; i++){
            System.out.println(list.get(i));     // Pass index here, list[index]
        }
    }
}
