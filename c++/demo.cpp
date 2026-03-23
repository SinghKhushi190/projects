// print Sum of first N numbers;
#include<iostream>
#include<string>
using namespace std;

// int sum(int n){
//     if(n ==0)
//     return 0;
//     return n+ sum(n-1);
// }

// int main(){
//     int n = 3;
//     cout << sum (n);

//     return 0;
// }

int fact(int n){
    if(n == 1)
        return 1;
    return n * fact(n-1);
}

int main(){
    int n = 3;
    cout << fact(n) << endl;
    return 0;
}



// Reverse an array using recursion (one pointer )

void f(int i , int arr[], int n){
    if(i >= n/2) return ;
    swap(arr[i], arr[n-i-1]);
    f(i+1, arr, n);

}


int main(){
    int n;
    int arr[n];
    for(int i = 0; i <n; arr[i]) cin >> arr[i];
    f(0, arr, n);
    for(int i =0; i<n; i++) cout<< arr[i] <<" ";
    return 0;
}


// check if a string is palindrom
bool f(int i , string &s){
    if(i >= s.size() - i -1) return true;
    if(s[i] != s[s.size() - i -1]) return false;
    return f(i+1, s);
}

int main(){
    string s = "madam";
    cout << f(0, s);
    return 0;
}


// fabonacci using recursion

int f(int n){
    if(n <= 1) return n;
    int last = f(n-1);
    int slast = f(n-2);
    return last + slast;

}

int main(){
    cout<< f(4);
    return 0;
}




