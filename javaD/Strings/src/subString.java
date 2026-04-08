public class subString {
    public static void main(String[] args) {
      StringBuilder sb = new StringBuilder("hello");
//        System.out.println(sb);

//        sb.append('e');
//        sb.append('l');
//        sb.append('l);
//        sb.append('o');
//        System.out.println(sb.length() );


        // char at index 0
//        System.out.println(sb.charAt(0));

        // set char at index 0
//        sb.setCharAt(0, 'P');
//        sb.insert(2,"n");   // for insert string

//        sb.delete(2, 4);      //delete the extra string
//        System.out.println(sb);


        // Reversed string with stringBuilder
        for(int i=0;i<sb.length()/2;i++){

            int front = i;
            int back = sb.length()-i-1;
            char frontchar = sb.charAt(front);
            char backchar = sb.charAt(back);

            sb.setCharAt(front,backchar);
            sb.setCharAt(back,frontchar);

        }
        System.out.println(sb);

    }
}
