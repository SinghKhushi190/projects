#include <iostream>
using namespace std;

int main()  // for matrix way to stored data
{
    int n, m;
    cin >> n >> m;
 //  graph stored  here
    int adj[n + 1][m + 1];
    for (int i = 0; i < m; i++)    // space -> O(N * N)
    {
        int u, v;
        cin >> u >> v;
        adj[u][v];
        adj[v][u];
    }
    return 0;
}

// list way to stored data in graph 

int main(){
    int n , m;
    cin >> n >> m;
    vector<int> adj[n+1];
    for(int i = 0; i < m; i++){   // space ->(2E)  //  here E -> represented Edge
        int u , v;
        cin >> u >> v;
        adj[u].push_back(v);
        adj[v].push_back(u);
    }
    return 0;
}


// Directed graph used [Space ->(E)]
 int main(){
     int n, m;
     cin >> n >> m;
     vector<int> adj[n + 1];
     for (int i = 0; i < m; i++)
     { // space ->(2E)  //  here E -> represe  nted Edge
         int u, v;
         // u ----> v
         cin >> u >> v;
         adj[u].push_back(v);
        //  adj[v].push_back(u);
     }
     return 0;
 }

 