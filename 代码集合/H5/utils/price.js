export function receivePrice(price, unit) { // unit:1 万元  2 元
    switch (unit) {
        case 1:
            return price / 100;
        case 2:
            return price / 1000000
    }
}