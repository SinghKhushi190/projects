public class Overloading {
    public static void main(String[] args) {
//        fun(67);
//        fun("iron man");
        int ans = sum(3, 4, 56);
        System.out.println(ans);
    }

    static int sum(int a, int b, int c){
        return a+b+c;
    }

static int sum(int a, int b){
        return a+b;
}


    public static void fun(int a){
        System.out.println(a);
    }

    public static void fun(String a){
        System.out.println(a);
    }
}

