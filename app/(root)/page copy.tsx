import ProductList from '@/components/shared/product/product-list';
import {
  getLatestProducts,
  getFeaturedProducts,
} from '@/lib/actions/product.actions';
import sampleData from '@/db/sample-data';
// console.log(sampleData.products)

// import ProductCarousel from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBoxes from '@/components/icon-boxes';
import DealCountdown from '@/components/deal-countdown';

const Homepage = async () => {

  // const latestProducts = await getLatestProducts();
  // const featuredProducts = await getFeaturedProducts();

  return (
    <>
      <ProductList data={sampleData.products} title='Newest Arrivals' />

      {/* {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title='Newest Arrivals' limit={4} /> */}
      {/* <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes /> */}
    </>
  );
};

export default Homepage;
