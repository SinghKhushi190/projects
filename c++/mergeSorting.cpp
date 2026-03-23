// sort [10, 5, 30, 15, 7]

#include <bits/stdc++.h>
using namespace std;

void mergeArrays(vector<int> &arr, int low, int mid, int high) {
    vector<int> temp;
    int left = low;
    int right = mid + 1;

    // Merge the two halves
    while (left <= mid && right <= high) {
        if (arr[left] <= arr[right]) {
            temp.push_back(arr[left]);
            left++;
        } else {
            temp.push_back(arr[right]);
            right++;
        }
    }

    // Remaining left half
    while (left <= mid) {
        temp.push_back(arr[left]);
        left++;
    }

    // Remaining right half
    while (right <= high) {
        temp.push_back(arr[right]);
        right++;
    }

    // Copy back to original array
    for (int i = low; i <= high; i++) {
        arr[i] = temp[i - low];
    }
}

void mS(vector<int> &arr, int low, int high) {
    if (low >= high) 
        return;

    int mid = (low + high) / 2;
    mS(arr, low, mid);
    mS(arr, mid + 1, high);
    mergeArrays(arr, low, mid, high);
}

void mergeSort(vector<int> &arr, int n) {
    mS(arr, 0, n - 1);
}

int main() {
    vector<int> arr = {10, 5, 30, 15, 7};

    mergeSort(arr, arr.size());

    cout << "Sorted Array: ";
    for (int x : arr) cout << x << " ";

    return 0;
}
