namespace backend.WS
{
    public static class WSMiddlewearExtension
    {
        public static IApplicationBuilder UseWebSocketServer(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<WSMiddlewear>();
        }
        public static IServiceCollection AddWebSocketServerConnectionManager(this IServiceCollection services)
        {
            services.AddSingleton<WSConnectionManager>();
            return services;
        }
    }
}
