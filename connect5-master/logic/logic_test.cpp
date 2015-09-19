#include <iostream>
using namespace std;

#define ROWS 8
#define COLUMNS 8
#define WINLEN 5

void R2L() {
	int t, p;
	int i, j;
	int k, l, m, ladder;
	
	int grid[][COLUMNS] = {{00,01,02,03,04,05,06,07},
						   {10,11,12,13,14,15,16,17},
						   {20,21,22,23,24,25,26,27},
						   {30,31,32,33,34,35,36,37},
						   {40,41,42,43,44,45,46,47},
						   {50,51,52,53,54,55,56,57},
						   {60,61,62,63,64,65,66,67},
						   {70,71,72,73,74,75,76,77},
						   };
	
	t = 1;
	for (k = WINLEN - 1; k < ROWS * 2 - 1 - WINLEN + 1; k++) {
        ladder = 0;
		for (l = 0; l < t; l++) {
			j = min(k, 7) - ladder; i = k - j;
			for (m = 0; m < WINLEN; m++) {
				cout << i + m << j - m << "\t";
			} cout << endl;
			ladder++;
		}
		if (k < ROWS - 1) {
			t++;
		} else {
			t--;
		}
		cout << endl;
    }
}

void L2R() {
	int t;
	int i, j;
	int k, l, m, ladder;
	
	t = 1;
	for (k = WINLEN - ROWS; k <= ROWS - WINLEN; k++) {	//difference in row index and col index is fixed for a particular diagonal
		ladder = 0;
		for (l = 0; l < t; l++) {
			j = max(k, 0) + ladder; i = j - k;
			for (m = 0; m < WINLEN; m++) {
				cout << i + m << j + m << "\t";
			} cout << endl;
			ladder++;
		}
		if (k >= 0) {
			t--;
		} else {
			t++;
		}
		cout << endl;
	}
}


int main() {
	
	int i, j, k;
	
	/*
	//horizontal
	for (i = 0; i < ROWS; i++) {
		for (k = 0; k < COLUMNS - WINLEN + 1; k++) {
			for (j = k; j < k + WINLEN; j++) {
				cout << i << j << "\t";
			}
			cout << endl;
		}
	}
	
	cout << "\n--------\n";
	
	//vertical
	for (i = 0; i < ROWS; i++) {
		for (k = 0; k < COLUMNS - WINLEN + 1; k++) {
			for (j = k; j < k + WINLEN; j++) {
				cout << j << i << "\t";
			}
			cout << endl;
		}
	}
	
	*/
	
	L2R();
	R2L();
	
}
