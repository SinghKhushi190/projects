// Largest ELement in the array

#include <bits/stdc++.h>
int largestElement(std::vector<int> &arr, int n)
{
    int largest = arr[0];
    for (int i = 0; i < n; i++)
    {
        if (arr[i] > largest)
        {
            largest = arr[i];
        }
    }
    return largest;
}

// Second Largest

int secondLargest(const std::vector<int> &a, int n)
{
    int largest = a[0];
    int slargest = INT_MIN;
    for (int i = 0; i < n; i++)
    {
        if (a[i] > largest)
        {
            slargest = largest;
            largest = a[i];
        }
        else if (a[i] < largest && a[i] > slargest)
        {
            slargest = a[i];
        }
    }
    return slargest;
}

int secondSmallest(const std::vector<int> &a, int n)
{
    int smallest = a[0];
    int ssmallest = INT_MAX;
    for (int i = 0; i < n; i++)
    {
        if (a[i] < smallest)
        {
            ssmallest = smallest;
            smallest = a[i];
        }
        else if (a[i] != smallest && a[i] < ssmallest)
        {
            ssmallest = a[i];
        }
    }
    return ssmallest;
}
std::vector<int> getSecondOrderElement(int n, const std::vector<int> &a)
{
    int slargest = secondLargest(a, n);
    int ssmallest = secondSmallest(a, n);
    return {slargest, ssmallest};
}

// left rotate the array by D place

#include <bits/stdc++.h>
#include <iostream>
using namespace std;
void leftRotate(int arr[], int n, int d)
{
    d = d % n;
    int temp[d];
    for (int i = 0; i < n; i++)
    {
        temp[i] = arr[i];
    }
    for (int i = d; i < n; i++)
    {
        arr[i - d] = arr[i];
    }
    for (int i = n - d; i < n; i++)
    {
        arr[i] = temp[i - (n - d)];
    }
}

int main()
{
    int n;
    cin >> n;
    int arr[n];
    for (int i = 0; i < n; i++)
    {
        cin >> arr[i];
    }

    int d;
    cin >> d;
    leftRotate(arr, n, d);
    for (int i = 0; i < n; i++)
    {
        cout << arr[i] << " ";
    }

    return 0;
}

// Union of two sorted array
vector<int> sortedArray(vector<int> a, vector<int> b)
{
    int n1 = a.size();
    int n2 = b.size();
    int i = 0;
    int j = 0;
    vector<int> unionArr;
    while (i < n1 && j < n2)
    {
        if (a[i] <= b[j])
        {
            if (unionArr.size() == 0 || unionArr.back() != a[i])
            {
                unionArr.push_back(a[i]);
            }
            i++;
        }
        else
        {
            if (unionArr.size() == 0 || unionArr.back() != b[i])
            {
                unionArr.push_back(b[j]);
            }
            j++;
        }
    }

    while (j < n2)
    {
        if (unionArr.size() == 0 || unionArr.back() != b[i])
        {
            unionArr.push_back(b[j]);
        }
        j++;
    }

    while (i < n1)
    {
        if (unionArr.size() == 0 || unionArr.back() != a[i])
        {
            unionArr.push_back(a[i]);
        }
        i++;
    }

    return unionArr;
}

// intersection of two sorted array

vector<int> findArrayIntersection(vector<int> &A, int n, vector<int> &B, int m)
{
    int i = 0;
    int j = 0;
    vector<int> ans;
    while (i < n && j < m)
    {
        if (A[i] < B[j])
        {
            i++;
        }
        else if (B[j] < A[i])
        {
            j++;
        }
        else
        {
            ans.push_back(A[i]);
            i++;
            j++;
        }
    }
    return ans;
}

// Longest subarray with sum K (only for positive) (Better solution)
int longestSubarrayWithSumK(vector<int> a, long long k)
{
    map<long long, int> preSumMap;
    long long Sum = 0;
    int maxLen = 0;
    for (int i = 0; i < a.size(); i++)
    {
        Sum += a[i];
        if (Sum == k)
        {
            maxLen = max(maxLen, i + 1);
        }

        int rem = Sum - k;
        if (preSumMap.find(rem) != preSumMap.end())
        {
            int len = i - preSumMap[rem];
            maxLen = max(maxLen, len);
        }
        preSumMap[Sum] = i;
    }
    return maxLen;
}

//   optimal solution for this question (positive , negative , zero)
int longestSubarrayWithSumK(vector<int> a, long long k)
{
    int left = 0, right = 0;
    long long sum = a[0];
    int maxLen = 0;
    int n = a.size();

    while (right < n)
    {
        while (left <= right && sum > k)
        {
            sum -= a[left];
            left++;
        }
        if (sum == k)
        {
            maxLen = max(maxLen, right - left + 1);
        }
        right++;
        if (right < n)
            sum += a[right];
    }
    return maxLen;
}

//  two sum (using hashmap)(for better solution)
vector<int> twoSum(vector<int> &nums, int target)
{
    map<int, int> mpp;
    int n = nums.size();

    for (int i = 0; i < n; i++)
    {
        int num = nums[i];
        int moreNeeded = target - num;

        if (mpp.find(moreNeeded) != mpp.end())
        {
            return {mpp[moreNeeded], i};
        }

        mpp[num] = i;
    }
    return {-1, -1};
}

/* Sam want to read exactly 'TARGET' number of pages.
HE has to array 'BOOK' containing the number of pages for 'N' books.
return YES/NO, if it is possible for him to read any 2 books and he can meet
his 'TARGET' number of pages.
EXAMPLES;
     Input: 'N' = 5, 'TARGET' = 5
     'BOOK' = [ 4, 1, 2, 3, 1]

     output: 'YES'  */

string read(int n, const vector<int> &book, int target)
{
    int left = 0, right = n - 1;
    sort(book.begin(), book.end());
    while (left < right)
    {
        int sum = book[left] + book[right];
        if (sum == target)
        {
            return "YES";
        }
        else if (sum < target)
            left++;
        else
            right--;
    }
    return "NO";
}

//   Sort an array of 0's , 1's and 2's (using dutch  National flag algorithm)
// arr [] = [0, 1,1, 0, 1, 2, 1, 2, 0, 0, 0]

void sortArray(vector<int> &arr, int n)
{
    int low = 0, mid = 0, high = n - 1;
    while (mid <= high)
    {
        if (arr[mid] == 0)
        {
            swap(arr[low], arr[mid]);
            low++;
            mid++;
        }
        else if (arr[mid] == 1)
        {
            mid++;
        }
        else
        {
            swap(arr[mid], arr[high]);
            high--;
        }
    }
}
// majority Element(n/2times)

// (Bettter solution)  [ Tc -> O(N logN)   & Sc -> O(N) ]
int majorityElement(vector<int> v)
{
    unordered_map<int, int> mpp;
    for (int i = 0; i < v.size(); i++)
    {
        mpp[v[i]]++;
    }
    for (auto it : mpp)
    {
        if (it.second > (v.size() / 2))
        {
            return it.first;
        }
    }
    return -1;
}

// majority Element( >n/3times)
//(Bettter Solution)
vector<int> majorityElementMoreThanThird(vector<int> v)
{
    vector<int> ls;
    map<int, int> mpp;
    int n = v.size();
    int mini = (int)(n / 3) + 1;
    for (int i = 0; i < n; i++)
    {
        mpp[v[i]]++;
        if (mpp[v[i]] == mini)
        {
            ls.push_back(v[i]);
        }
        if (ls.size() == 2)
            break;
    }

    sort(ls.begin(), ls.end());
    return ls;
}

// Alternate Numbers
// Start the array with a positive number. if any of the positive and negative numbers are left, and them at the end without altering the order.

vector<int> alternateNumbers(vector<int>&a){
    vector<int> pos, neg;
    int n = a.size();
    for(int i =0; i<n; i++){
        if(a[i] > 0){
            pos.push_back(a[i]);
        }
        else{
            neg.push_back(a[i]);
        }
    }

    if(pos.size() > neg.size()){
        for(int i = 0; i < neg.size(); i++){
            a[2*i] ==pos[i];
            a[2*i+1] = pos[i];
        }
        int index = neg.size() *2;
        for(int i = neg.size(); i< pos.size(); i++){
            a[index] = pos[i];
            index++;
        }
    }
    else{
         for(int i = 0; i < pos.size(); i++){
            a[2*i] ==pos[i];
            a[2*i+1] = neg[i];
        }
         int index = pos.size() *2;
        for(int i = pos.size(); i< neg.size(); i++){
            a[index] = neg[i];
            index++;
        }
    }
    return a;
}

// Leaders is an array 
// arr[] = [10 , 22, 12, 3, 0 , 6]
vector<int> superiorElements(vector<int> &a){
    // sc -> O(N)
    vector<int> ans;
    int maxi = INT_MIN;
    int n = a.size();
       // O(N)
    for(int i = n-1; i >= 0; i--){
        if(a[i] > maxi){
            ans.push_back(a[i]);
        }

        maxi = max(maxi , a[i]);
    }
       // O(NlogN)
    sort(ans.begin(), ans.end());
    return ans;
}

// Longest Consecutive Sequence(Better Solution)
int longestSucessiveElements(vector<int>&nums){
    if(nums.size() == 0) return 0;
    sort(nums.begin() , nums.end());
    int n = nums.size();
    int lastSmaller = INT_MIN;
    int cnt = 0;
    int longest = 1;
    for(int i = 0; i < n; i++){
        if(nums[i]-1 == lastSmaller){
            cnt += 1;
            lastSmaller = nums[i];
        }
        else if(lastSmaller != nums[i]){
            cnt = 1;
            lastSmaller = nums[i];
        }
        longest = max(longest , cnt);
    }
    return longest;
}

// Set matrix zeroes
vector<vector<int>> zeroMatrix(vector<vector<int>> &matrix , int n , int m)
{
    int col[m] = {0};
    int row [n] = {0};
    for(int i =0; i < n; i++){
        for(int j =0; j < m; j++){
            if(matrix[i][j] == 0){
                row[i] = 1;
                col[j] = 1;
            }
        }
    }
    for(int i = 0; i < n; i++){
        for(int j =0; j < m; j++){
            if(row[i] == 1 || col[j] == 1){
                matrix[i][j] = 0;
            }
        }
    }

    return matrix;
}


// Count Subarrays Sum Equals K
int findSubarrayWithGivenSum(vector<int> &arr, int k ){
    unordered_map<int , int> mpp;
    int preSum = 1;
    int preSum = 0, cnt = 0;
      // O(N * logN)  -> Tc
      // O(N)  -> Sc
    for(int i = 0; i < arr.size(); i++){
        preSum += arr[i];
        int remove = preSum - k;
        cnt += mpp[remove];
        mpp[preSum] += 1;
    }
    return cnt;
}
// Count pairs in an array such that a[i] > 2*a[j]
int cnt = 0;
void merge(vector<int>&arr , int low , int mid , int high){
    vector<int> temp;
    int left = low , right = mid + 1;
    while(left <= mid && right <= high){
        if(arr[left] <= arr[right]){
            temp.push_back(arr[left]);
            left++;
        }
        else{
            temp.push_back(arr[right]);
            cnt += (mid - left + 1);
            right++;
        }
    }
// if elements are still left in the left part
    while(left <= mid){
        temp.push_back(arr[left]);
        left++;
    }
    // if elements are still left in the right part
    while(right <= high){
        temp.push_back(arr[right]);
        right++;
    }

    for(int i = low; i <= high; i++){
        arr[i] = temp[i - low];
    }
}

// countPairs function should be outside merge
void countPairs(vector<int>&arr , int low , int high){
    int mid = (low + high) / 2;
    int right = mid + 1;
    for(int i = low; i <= mid; i++){
        while(right <= high && arr[i] > 2LL * arr[right]){
            right++;
        }
        cnt += (right - (mid + 1));
    }
}

void mergeSort(vector<int>&arr , int low , int high){
    if(low >= high) return;
    int mid = (low + high)/2;
    mergeSort(arr , low , mid);
    mergeSort(arr , mid + 1, high);
    countPairs(arr , low , high);
    merge(arr , low , mid , high);
}

int team(vector<int>&skills , int n){
    // cnt = 0;
    mergeSort(skills , 0 , n-1);
    return cnt;
}