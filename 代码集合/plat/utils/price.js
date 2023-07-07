export function receivePrice(price, unit) { // unit:1 元  2 万元
    switch (unit) {
        case 1:
            return price / 100;
        case 2:
            return price / 1000000
    }
}