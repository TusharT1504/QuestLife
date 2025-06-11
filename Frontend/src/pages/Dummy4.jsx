const Dummy4 = () => {
  return (
    <div className="min-h-screen bg-snow py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-jet-black mb-4">
            Dummy Page 4
          </h1>
          <p className="text-lg text-dim-gray">
            The final placeholder page with a different layout approach.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gainsboro p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-jet-black mb-4">
              Contact Information
            </h2>
            <p className="text-dim-gray">
              This is a sample contact section demonstrating form-like layouts.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-gainsboro pb-4">
              <h3 className="text-lg font-semibold text-jet-black mb-2">
                Email
              </h3>
              <p className="text-onyx">contact@questlife.com</p>
            </div>
            
            <div className="border-b border-gainsboro pb-4">
              <h3 className="text-lg font-semibold text-jet-black mb-2">
                Phone
              </h3>
              <p className="text-onyx">+1 (555) 123-4567</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-jet-black mb-2">
                Address
              </h3>
              <p className="text-onyx">
                123 Quest Street<br />
                Adventure City, AC 12345<br />
                United States
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dummy4; 