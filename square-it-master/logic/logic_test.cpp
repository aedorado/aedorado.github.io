#include <bits/stdc++.h>
using namespace std;

struct Point {
    int x;
    int y;
};

int distSq(Point p, Point q) {
    return (p.x - q.x)*(p.x - q.x) +
           (p.y - q.y)*(p.y - q.y);
}


bool isSquare(Point p1, Point p2, Point p3, Point p4)	{
//	cout << p1.x << " " << p1.y << endl;
//    cout << p2.x << " " << p2.y << endl;
//    cout << p3.x << " " << p3.y << endl;
//    cout << p4.x << " " << p4.y << endl;
    
	int d2 = distSq(p1, p2);  
    int d3 = distSq(p1, p3);  
    int d4 = distSq(p1, p4); 
//    cout << d2 << "\t" << d3 << "\t" << d4 << endl;
 
    // If lengths if (p1, p2) and (p1, p3) are same, then
    // following conditions must met to form a square.
    // 1) Square of length of (p1, p4) is same as twice
    //    the square of (p1, p2)
    // 2) p4 is at same distance from p2 and p3
    if (d2 == d3 && 2*d2 == d4)
    {
        int d = distSq(p2, p4);
        return (d == distSq(p3, p4) && d == d2);
    }
 
    // The below two cases are similar to above case
    if (d3 == d4 && 2*d3 == d2)
    {
        int d = distSq(p2, p3);
        return (d == distSq(p2, p4) && d == d3);
    }
    if (d2 == d4 && 2*d2 == d3)
    {
        int d = distSq(p2, p3);
        return (d == distSq(p3, p4) && d == d2);
    }
 
    return false;
}

int main() {
	int n, i, j, k, l;
	Point a, b, c, d;

	cout << "Enter number of points (n > 4): ";
	cin >> n;
	assert(n > 3);
	Point points[n];

	cout << "Enter number of points : ";
	for (i = 0; i < n; i++) {
		cin >> points[i].x >> points[i].y;
	}
//	for (i = 0; i < n; i++) {
//		cout << points[i].x << " " << points[i].y << endl;
//	}

	for (i = 0; i < n - 3; i++) {
		a = points[i];
//		cout << "A : " << a.x << " " << a.y << endl;
		for (j = i + 1; j < n - 2; j++) {
			b = points[j];
//			cout << "B : " << b.x << " " << b.y << endl;
			for (k = j + 1; k < n - 1; k++) {
				c = points[k];
//				cout << "C : " << c.x << " " << c.y << endl;
				for (l = k + 1; l < n; l++) {
					d = points[l];
//					cout << "D : " << d.x << " " << d.y << endl;
					//cout << isSquare(a, b, c, d) << endl;
					if (isSquare(a, b, c, d)) {
						cout << "Yes\n";
						cout << a.x << " " << a.y << endl;
						cout << b.x << " " << b.y << endl;
						cout << c.x << " " << c.y << endl;
						cout << d.x << " " << d.y << endl;
						break;
					}
				}
			}
		}
	}
	if (i == n - 3 && j == n - 2 && k == n - 1 && l == n) {
		cout << "No\n";
	}
	
	return 0;
}