public class StringBasic {
    public static void main(String[] args) {
        String name = "harry";
        System.out.println(name);
        //  print length
        System.out.println(name.length());
        // Show  uppercase
        System.out.println(name.toUpperCase());
        //show lowercase
        System.out.println(name.toLowerCase());
            // print index
        System.out.println(name.substring(0,1));

        System.out.println(name.substring(1,4));
        // Replace index and print
        System.out.println(name.replace('r','p'));
        // Print stating index
        System.out.println(name.startsWith("har"));
        // print ending index
        System.out.println(name.endsWith("r"));
           // find character in index
        System.out.println(name.charAt(0));


    }
}



