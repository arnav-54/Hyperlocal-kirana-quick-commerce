import prisma from '../config/prisma';

class StoreService {
  public async createStore(ownerId: string, storeData: any) {
    const { name, address, lng, lat } = storeData;

    return await prisma.store.create({
      data: {
        name,
        address,
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
        ownerId,
      },
    });
  }

  public async findNearbyStores(lng: number, lat: number, radius: number) {
    const stores = await prisma.store.findMany({
      include: {
        inventory: {
          include: {
            product: true
          }
        }
      }
    });

    if (!isNaN(lng) && !isNaN(lat)) {
      return stores.filter(store => {
        const [sLng, sLat] = store.location.coordinates;
        const dist = Math.sqrt(Math.pow(sLng - lng, 2) + Math.pow(sLat - lat, 2));
        return dist < (radius / 111000);
      });
    }

    return stores;
  }

  public async getStoreById(id: string) {
    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        inventory: {
          include: {
            product: true
          }
        }
      }
    });
    if (!store) throw { status: 404, message: 'Store not found' };
    return store;
  }

  public async getStoreByOwnerId(ownerId: string) {
    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        inventory: {
          include: {
            product: true
          }
        }
      }
    });
    if (!store) throw { status: 404, message: 'Store not found' };
    return store;
  }
}

export default new StoreService();
