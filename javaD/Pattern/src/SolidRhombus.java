
public class SolidRhombus {

    public static void main(String[] args) {
        int n = 5;  // size of the rhombus

        for (int i = 1; i <= n; i++) {
            // print spaces before stars
            for (int j = 1; j <= n - i; j++) {
                System.out.print(" ");
            }

            // print stars
            for (int j = 1; j <= n; j++) {
                System.out.print("*");
            }

            System.out.println();
        }
    }
}
