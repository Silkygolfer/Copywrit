import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function ContactUs() {
  return (
    <section id="contact" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Get in touch</h2>
                  <p className="text-lg text-gray-300 mb-8">
                    Have questions or need assistance? Our team is here to help you get the most out of our platform.
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2 text-white">Email Us</h3>
                      <p className="text-gray-300">support@company.com</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Call Us</h3>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-white">Visit Us</h3>
                      <p className="text-gray-300">
                        123 Innovation Street
                        <br />
                        San Francisco, CA 94103
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-6 text-white">Send us a message</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="first-name" className="block text-sm font-medium mb-1 text-white">
                          First name
                        </label>
                        <Input id="first-name" />
                      </div>
                      <div>
                        <label htmlFor="last-name" className="block text-sm font-medium mb-1 text-white">
                          Last name
                        </label>
                        <Input id="last-name" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1 text-white">
                        Email
                      </label>
                      <Input id="email" type="email" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-1 text-white">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full rounded-md border border-gray-600 bg-gray-700 text-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                      ></textarea>
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
  )
}