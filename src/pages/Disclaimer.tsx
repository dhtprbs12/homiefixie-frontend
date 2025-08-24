
export default function Disclaimer() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Disclaimer</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Limitations</h2>
              <p className="text-gray-700 mb-4">
                The home repair analysis provided by this service is for informational purposes only and should not be considered as professional advice. Our AI-powered analysis has limitations and may not be 100% accurate.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Analysis is based on limited information provided and may not capture all aspects of your specific situation</li>
                <li>AI recommendations may not account for local building codes, regulations, or specific conditions</li>
                <li>Complex or structural issues require professional inspection and consultation</li>
                <li>Safety considerations may not be comprehensive for all scenarios</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Consultation Recommended</h2>
              <p className="text-gray-700 mb-4">
                For any major repairs, structural work, electrical, plumbing, or gas-related issues, we strongly recommend consulting with licensed professionals. This service is not a substitute for professional inspection, diagnosis, or repair services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">No Warranty</h2>
              <p className="text-gray-700 mb-4">
                We provide this analysis service "as is" without any warranties, express or implied. We do not guarantee the accuracy, completeness, or reliability of any analysis, recommendations, or information provided.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Under no circumstances shall we be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of this service or reliance on any analysis or recommendations provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Use at Your Own Risk</h2>
              <p className="text-gray-700">
                By using this service, you acknowledge that you understand these limitations and agree to use the information provided at your own risk. Always prioritize safety and seek professional help when in doubt.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}