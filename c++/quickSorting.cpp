//  Quick sorting 

#include <bits/stdc++.h>
using namespace std;

int partition(vector<int> &arr, int low, int high) {
    int pivot = arr[low];
    int i = low;
    int j = high;

    while (i < j) {

        // Move i to the right until arr[i] > pivot
        while (arr[i] <= pivot && i <= high - 1) {
            i++;
        }

        // Move j to the left until arr[j] <= pivot
        
        while (arr[j] > pivot && j >= low + 1) {
            j--;
        }

        if (i < j) {
            swap(arr[i], arr[j]);
        }
    }

    swap(arr[low], arr[j]);
    return j;
}

void qs(vector<int> &arr, int low, int high) {
    if (low < high) {
        int pIndex = partition(arr, low, high);
        qs(arr, low, pIndex - 1);
        qs(arr, pIndex + 1, high);
    }
}


//  here in this code Time complexity = O(Nlogn)
//  Space complexity = O(1)