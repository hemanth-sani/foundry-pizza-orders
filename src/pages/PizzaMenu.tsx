import Layout from "../Layout";
import PizzaCard from "../components/PizzaCard";
import usePizzaMenu from "../hooks/usePizzaMenu";

export default function PizzaMenu() {
  const { groupedMenu, isLoading, isError } = usePizzaMenu();

  return (
    <Layout>
      <h2>🍕 Pizza Menu</h2>
      {isLoading && <p>Loading menu...</p>}
      {isError && <p>Error loading menu.</p>}
      
      {!isLoading && !isError && (
        <div className="menuContainer">
          {Object.entries(groupedMenu).map(([name, variants]) => (
            <PizzaCard key={name} name={name} variants={variants} />
          ))}
        </div>
      )}
    </Layout>
  );
}
