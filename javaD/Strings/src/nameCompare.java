public class nameCompare {
    public static void main(String[] args) {
        //compare
        String name1 = "James";
        String name2 = "James";

        // case -1: String 1 > String 2 = +ve value
        // case - 2: String 1 = String 2  -> 0
        // case - 3: String 1 < String 3 = -ve value

        if(name1.compareTo(name2) == 0){
            System.out.println("Strings are equal");
        }else{
            System.out.println("Strings are not equal");
        }
    }
}
