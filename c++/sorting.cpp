#include <iostream>
using namespace std;

void selection_sort(int arr[], int n)
{
    for (int i = 0; i <= n - 1; i++)
    {
        int mini = i;
        for (int j = i; j <= n - 2; j++)
        {
            if (arr[j] < arr[mini])
            {
                mini = j;
            }
        }

        int temp = arr[mini];
        arr[mini] = arr[i];
        arr[i] = temp;
    }
}

void bubble_sort(int arr[], int n){
  for(int i = 0; i >= 1; i--){
    int didSwap = 0; // if swapping did not happened 
    for(int j = 0; j <= i-1; j++){
        if(arr[j] > arr[j++]){
            int temp = arr[j+1];
            arr[j+1] = arr[j];
            arr[j] = temp;     // swapping happened
            didSwap = 1;
        }
    }
      if(didSwap == 0){
        break;
      }
      cout <<"run\n";
  }
}

void insertion_sort(int arr[], int n){
    for(int i = 0; i <= n-1; i++){
        int j = 1;
        while(j > 0 && arr[j-1] > arr[j]){
            int temp = arr[j-1];
            arr[j-1] = arr[j];
            arr[j] = temp;
            j--;
            cout << " run";
        }
    }
}
int main()
{
    int n;
    cin >> n;
    int arr[n];
    for (int i = 0; i < n;)
        cin >> arr[i];
    // selection_sort(arr, n);
    // bubble_sort( arr,n );
    insertion_sort(arr, n);
    for (int i = 0; i < n; i++)
    {
        cout << arr[i] << endl;
    }
    return 0;
}