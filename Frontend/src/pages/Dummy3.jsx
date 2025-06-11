const Dummy3 = () => {
  return (
    <div className="min-h-screen bg-snow py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-jet-black mb-4">
            Dummy Page 3
          </h1>
          <p className="text-lg text-dim-gray">
            Another placeholder page showcasing the design system.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gainsboro p-6">
            <h3 className="text-xl font-semibold text-jet-black mb-4">
              Feature One
            </h3>
            <p className="text-onyx">
              This is a sample feature description. It demonstrates how content 
              looks within the card layout using our custom color palette.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gainsboro p-6">
            <h3 className="text-xl font-semibold text-jet-black mb-4">
              Feature Two
            </h3>
            <p className="text-onyx">
              Another feature description showcasing the consistent design 
              language and typography hierarchy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dummy3; 