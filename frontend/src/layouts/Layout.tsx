interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <div className="overflow-y-auto">{children}</div>;
};

export default Layout;
