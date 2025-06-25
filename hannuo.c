#include <stdio.h>


void hannuo(int n,char from,char to ,char aux) {
    //  Move disk from source to target
    if(n == 1) {
        printf("move disk 1 from %c to %c", from, to);
        return;
    }
    // Step1: Move disk from source to middle
    hannuo(n-1, from, aux, to);
    // Step2: Move disk from source to target
    printf("move disk %d from %c to %c",n, from, to,aux)
    // Step3: Move disk from aux to target
    hannuo(n-1, aux,to,from);
}
int main() {
    int n = 5
    hannuo(n, 'A','B','C')
    return 0;
}